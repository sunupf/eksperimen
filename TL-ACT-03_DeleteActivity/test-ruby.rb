require "selenium-webdriver"

class Test
  def initialize(testCase,driver)
    @testCase =  testCase
    @driver =  driver
  end
  def run
    wait = Selenium::WebDriver::Wait.new(:timeout => 30)

    wait.until { @driver.find_element(:css => '#activity-list li').displayed? }

    puts @driver.find_element(:css => '#activity-list li').displayed?

    url = @testCase['testCases']['target'];
    id = url.gsub("http://todo.app/activity/","")


    begin
      element = @driver.find_element :css => "#activity-#{id}"
      delete = @driver.find_element :css => "#activity-#{id} a.delete"
      puts "id"
    rescue
      puts "first"
      element = @driver.find_element :css => "#activity-list>li:first-child"
      delete = @driver.find_element :css => "#activity-list>li:first-child>a.delete"
      @driver.execute_script("arguments[0].setAttribute('data-target','#{url}')" , delete)
    end

    action = @driver.action
    action.move_to(element).move_to(delete).click().perform()

    wait.until { @driver.find_element(:css => '.showSweetAlert.visible, .uk-alert.uk-alert-danger p').displayed? }

    confirm = @testCase['testCases']['confirm'];

    if (confirm.to_i === 0)
      cancel = @driver.find_element :css => ".showSweetAlert.visible .cancel"
      puts cancel.text
      cancel.click
      begin
        return element.displayed?
      rescue
        return false
      end
    elsif (confirm.to_i > 0)
      yes = @driver.find_element :css => ".showSweetAlert.visible .confirm"
      yes.click

      wait.until { @driver.find_element(:css => '.showSweetAlert.visible h2, #registration-form').displayed? }

      respons = @driver.find_elements :css => ".uk-alert.uk-alert-danger p"
      if(respons.empty?)
        respons = @driver.find_elements :css => ".showSweetAlert.visible h2"
      end

      result = Array.new

      respons.each do |respon|
        result.push respon.text
      end

      expect = @testCase['messages']

      puts expect
      puts "///"
      puts result

      return Set.new(expect) === Set.new(result)
    end
  end
end
