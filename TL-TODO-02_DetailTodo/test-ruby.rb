require "selenium-webdriver"

class Test
  def initialize(testCase,driver)
    @testCase =  testCase
    @driver =  driver
  end
  def run
    # Here some example
    wait = Selenium::WebDriver::Wait.new(:timeout => 30)
    wait.until { @driver.find_element(:css => '.activities, #registration-form').displayed? }

    respons = @driver.find_elements :css => ".sut-list li, .uk-alert.uk-alert-danger p"

    result = Array.new

    respons.each do |respon|
      if respon.attribute("class") != "uk-clearfix activity-item"
        result.push respon.text
      elsif respon.attribute("class") === "uk-clearfix activity-item"
        result.push respon.attribute("class").gsub("uk-clearfix ","")
      end
    end

    expect = @testCase['messages']

    return Set.new(expect) === Set.new(result)
  end
end
